# Microservicio IA - Chamilo CTA

Microservicio web que se integra con Chamilo LMS para el curso de Ciencia, Tecnología y Ambiente (CTA), potenciado por IA usando OpenRouter API.

## Características

### 🎯 Funcionalidades Principales

1. **Generación de Cuestionarios**
   - Cuestionarios automáticos sobre temas de CTA
   - Preguntas de opción múltiple, verdadero/falso y abiertas
   - Exportación en formato Markdown

2. **Generación de Resúmenes**
   - Resúmenes estructurados y claros
   - Diferentes niveles de extensión
   - Puntos clave y conceptos importantes destacados

3. **Retroalimentación de Respuestas**
   - Evaluación automática de respuestas abiertas
   - Puntuación del 0 al 100
   - Identificación de fortalezas y áreas de mejora

4. **Gestión de Material**
   - Carga y organización del material del curso
   - Detección automática de temas desde archivos .txt

### 🚀 Tecnologías

- **Frontend**: Next.js 15, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **IA**: OpenRouter API (compatible con múltiples modelos)
- **Despliegue**: Vercel

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` con tu clave API de OpenRouter:

\`\`\`env
OPENROUTER_API_KEY=tu_clave_api_aqui
\`\`\`

### 2. Instalación Local

\`\`\`bash
# Clonar el repositorio
git clone [url-del-repo]
cd microservicio-chamilo-cta

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
\`\`\`

### 3. Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `OPENROUTER_API_KEY` en el dashboard de Vercel
3. Despliega automáticamente

## Uso

### Integración con Chamilo

El microservicio puede integrarse con Chamilo de varias formas:

1. **Enlace directo**: Agregar enlaces a las diferentes funcionalidades en el curso
2. **iFrame**: Embeber el microservicio completo o funcionalidades específicas
3. **Ventana emergente**: Abrir funcionalidades en ventanas modales

### Gestión de Material

1. Sube tus archivos .txt a la carpeta `data/cta-materials/`
2. Ve a "Gestión de Material" para verificar que se detecten correctamente
3. Los temas estarán disponibles automáticamente en todas las herramientas

### Temas Disponibles

- Biotecnología
- Campos de Aplicación del Método Científico
- El Conocimiento Científico y Empírico
- El Método Científico - La Penicilina
- La Ciencia
- Materiales de Laboratorio
- Método Científico
- Personajes de Ciencia

## Optimización

- **Uso eficiente de tokens**: Los archivos solo se usan para detectar temas
- **API compatible**: Funciona con cualquier modelo disponible en OpenRouter
- **Respuestas estructuradas**: Formato JSON para procesamiento eficiente

## Personalización

### Agregar Nuevos Temas

Edita el mapeo en `lib/material-loader.ts` para agregar nuevos archivos y temas.

### Modificar Prompts

Los prompts de IA están en los archivos de API (`app/api/*/route.ts`). Puedes modificarlos para ajustar el comportamiento de la IA.

### Cambiar Modelo de IA

Para usar un modelo diferente, cambia en los archivos de API:

\`\`\`typescript
model: openai('gpt-4'), // o cualquier modelo disponible en OpenRouter
\`\`\`

## Soporte

Para problemas técnicos o preguntas sobre la implementación, revisa:

1. Los logs de la consola del navegador
2. Los logs de Vercel (si está desplegado)
3. La documentación de OpenRouter: https://openrouter.ai/docs

## Licencia

Este proyecto está diseñado específicamente para uso educativo con Chamilo LMS.
