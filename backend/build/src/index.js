"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const auth_1 = require("./middleware/auth");
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const password_routes_1 = __importDefault(require("./routes/password.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/sessions', session_routes_1.default);
app.use('/password', password_routes_1.default);
const apiRouter = express_1.default.Router();
apiRouter.use(auth_1.authMiddleware);
apiRouter.use('/companies', company_routes_1.default);
apiRouter.use('/products', product_routes_1.default);
apiRouter.use('/users', user_routes_1.default);
app.use('/api', apiRouter);
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log("--- MAPA DE ROTAS REGISTRADAS ---");
    console.table((0, express_list_endpoints_1.default)(app));
    console.log("---------------------------------");
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
