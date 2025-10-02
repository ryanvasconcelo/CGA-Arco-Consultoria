# Sistema de Design - Arco Solutions

## 🎨 Paleta de Cores

### Cores da Marca
A identidade visual da Arco é baseada em duas cores principais:

- **Primary (Amarelo/Âmbar)**: `hsl(45, 95%, 50%)` - Cor principal da marca
- **Secondary (Azul Marinho)**: `hsl(220, 15%, 15%)` - Cor corporativa

### Como Usar

#### Em CSS/Tailwind
```jsx
// Primary
className="bg-primary text-primary-foreground"
className="hover:bg-primary/90"

// Secondary
className="bg-secondary text-secondary-foreground"
```

#### Em componentes
```jsx
// Usando variáveis CSS
style={{ backgroundColor: 'hsl(var(--primary))' }}
```

---

## 🏷️ Badges

### Role Badges (Badges de Função)
Cores padronizadas para diferentes funções de usuário:

```jsx
// Super Admin - Gradiente Roxo/Rosa
className="bg-gradient-to-r from-[hsl(var(--role-super-admin-from))] to-[hsl(var(--role-super-admin-to))] text-white"

// Admin - Gradiente Azul/Ciano
className="bg-gradient-to-r from-[hsl(var(--role-admin-from))] to-[hsl(var(--role-admin-to))] text-white"

// User - Gradiente Verde
className="bg-gradient-to-r from-[hsl(var(--role-user-from))] to-[hsl(var(--role-user-to))] text-white"
```

### Status Badges (Badges de Status)
```jsx
// Ativo
<Badge className="bg-[hsl(var(--success-light))] text-[hsl(var(--success))] border-[hsl(var(--success))]/30">
  Ativo
</Badge>

// Inativo
<Badge className="bg-[hsl(var(--error-light))] text-[hsl(var(--error))] border-[hsl(var(--error))]/30">
  Inativo
</Badge>

// Pendente
<Badge className="bg-[hsl(var(--warning-light))] text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30">
  Pendente
</Badge>
```

---

## 🔘 Botões

### Variantes Disponíveis

```jsx
// Primary (Padrão)
<Button>Botão Primário</Button>

// Outline
<Button variant="outline" className="border-border hover:bg-muted/50">
  Botão Outline
</Button>

// Secondary
<Button variant="secondary">Botão Secundário</Button>

// Destructive (Ações destrutivas)
<Button variant="destructive">Remover</Button>

// Ghost
<Button variant="ghost">Botão Ghost</Button>
```

---

## 📝 Inputs

### Input Padrão
```jsx
<Input 
  className="glass-input" 
  placeholder="Digite aqui..."
/>
```

Os inputs já possuem:
- Foco com destaque primary
- Hover com borda primary/50
- Transição suave
- Fonte medium weight

---

## 🎴 Cards

### Card Padrão
```jsx
<Card className="glass-card border-white/10">
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

---

## 📊 Cores de Status

### Success (Sucesso)
```jsx
className="bg-[hsl(var(--success-light))] text-[hsl(var(--success))]"
```

### Error (Erro)
```jsx
className="bg-[hsl(var(--error-light))] text-[hsl(var(--error))]"
```

### Warning (Aviso)
```jsx
className="bg-[hsl(var(--warning-light))] text-[hsl(var(--warning))]"
```

### Info (Informação)
```jsx
className="bg-[hsl(var(--info-light))] text-[hsl(var(--info))]"
```

---

## 🎭 Efeitos Especiais

### Glass Effect (Efeito Vidro)
```jsx
className="glass-card"
// ou
className="bg-background/50 backdrop-blur-md border-white/10"
```

### Hover Effects
```jsx
// Lift (Elevação)
className="hover-lift"

// Glow (Brilho)
className="hover-glow"
```

### Shadows (Sombras)
```jsx
className="shadow-soft"    // Sombra suave
className="shadow-medium"  // Sombra média
className="shadow-strong"  // Sombra forte
```

---

## 📐 Tipografia

### Headings
```jsx
// Heading Primary
<h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
  Título Principal
</h1>

// Heading Secondary
<h2 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
  Subtítulo
</h2>
```

### Gradiente de Texto
```jsx
className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"
```

---

## 🌙 Dark Mode

Todas as cores possuem variantes para dark mode automaticamente aplicadas através das variáveis CSS. Não é necessário código adicional.

---

## 📦 Arquivo de Sistema de Design (TypeScript)

Para usar cores programaticamente, importe o arquivo:

```tsx
import { colors, getRoleGradient, getStatusColor } from '@/styles/design-system';

// Usar cores
const primaryColor = colors.brand.primary;

// Obter gradiente de role
const gradient = getRoleGradient('ADMIN');

// Obter cor de status
const statusColor = getStatusColor('ACTIVE');
```

---

## ✅ Checklist de Implementação

Ao criar novos componentes ou páginas, certifique-se de:

- [ ] Usar variáveis CSS (`hsl(var(--primary))`) ao invés de cores hardcoded
- [ ] Aplicar `transition-all duration-200` para animações suaves
- [ ] Usar `shadow-soft`, `shadow-medium` ou `shadow-strong` para sombras
- [ ] Aplicar `border-border` para bordas consistentes
- [ ] Usar `text-foreground` para texto principal
- [ ] Usar `text-muted-foreground` para texto secundário
- [ ] Testar em dark mode
- [ ] Garantir acessibilidade (contraste adequado)

---

## 🚀 Exemplo Completo

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ExemploComponente() {
  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Exemplo de Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Badge className="bg-gradient-to-r from-[hsl(var(--role-admin-from))] to-[hsl(var(--role-admin-to))] text-white">
            Administrador
          </Badge>
          
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium transition-all">
            Ação Principal
          </Button>
          
          <Button variant="outline" className="w-full border-border hover:bg-muted/50">
            Ação Secundária
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📞 Suporte

Para dúvidas sobre o sistema de design, consulte:
- `/frontend/src/styles/design-system.ts` - Definições TypeScript
- `/frontend/src/index.css` - Variáveis CSS globais
- `/frontend/tailwind.config.ts` - Configuração do Tailwind

---

**Última atualização**: 2025
**Versão**: 1.0.0