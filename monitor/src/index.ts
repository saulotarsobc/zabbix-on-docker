import dotenv from "dotenv";
import express from "express";
import { validateToken } from "./middlewares";
import { containersRouter } from "./routes/containers";

dotenv.config();
// Configuracoes
const PORT = process.env.PORT || 3000;

// App
const app = express();

// Middlewares
app.use(validateToken);
app.use(express.json());

// Rotas
app.use("/containers", containersRouter);

// Servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
