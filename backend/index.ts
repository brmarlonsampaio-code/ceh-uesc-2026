import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_ciclo2026';

// 1. Strict CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://brmarlonsampaio-code.github.io' 
    : ['http://localhost:5173', 'http://127.0.0.1:5173']
}));
app.use(express.json());

// 2. Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: { error: 'Muitas requisições deste IP, tente novamente em 15 minutos.' }
});
app.use(globalLimiter);

// 3. Strict Rate Limiting para Autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limite de 10 tentativas
  message: { error: 'Muitas tentativas de login/registro, tente novamente mais tarde.' }
});

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'API do Ciclo de Estudos Históricos UESC 2026' });
});

// Registro
app.post('/auth/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

// Login
app.post('/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// Middleware de Autenticação
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido.' });
  }
};

// Rota Protegida (Dashboard)
app.get('/user/profile', authMiddleware, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
});

// Criar nova submissão
app.post('/submissions', authMiddleware, async (req: any, res: any) => {
  const { title, abstract, driveLink } = req.body;

  if (!title || !abstract || !driveLink) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        title,
        abstract,
        driveLink,
        userId: req.user.userId,
      },
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar submissão.' });
  }
});

// Listar submissões do usuário logado
app.get('/submissions', authMiddleware, async (req: any, res: any) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar submissões.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
