# Microservicio IA - Chamilo CTA

Microservicio web que se integra con Chamilo LMS para el curso de Ciencia, Tecnología y Ambiente (CTA), potenciado por IA usando Gemini 2.0 Flash a través de OpenRouter.

## Características

### 🎯 Funcionalidades Principales

1. **Generación de Cuestionarios**
   - Cuestionarios automáticos basados en el material del curso
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

4. **Sugerencias de Recursos**
   - Recomendaciones personalizadas de recursos adicionales
   - Diferentes tipos: lecturas, videos, actividades, sitios web
   - Adaptado al nivel del estudiante

5. **Análisis de Progreso**
   - Análisis del rendimiento del estudiante
   - Identificación de patrones y tendencias
   - Recomendaciones específicas para mejorar

6. **Gestión de Material**
   - Carga y organización del material del curso
   - Edición y eliminación de contenido
   - Reutilización eficiente para ahorrar tokens

### 🚀 Tecnologías

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **IA**: Gemini 2.0 Flash via OpenRouter
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

### URLs de Funcionalidades

- Panel principal: `/`
- Todas las funcionalidades están accesibles desde el panel principal

### Gestión de Material

1. Ve a "Gestión de Material"
2. Agrega el contenido de tus PDFs o documentos del curso
3. Organiza por temas
4. El material estará disponible para todas las herramientas de IA

## Optimización de Tokens

- **Material reutilizable**: El contenido se carga una vez y se reutiliza
- **Gemini 2.0 Flash**: Modelo optimizado para velocidad y bajo consumo
- **Prompts eficientes**: Instrucciones concisas y específicas
- **Respuestas estructuradas**: Formato JSON para procesamiento eficiente

## Personalización

### Agregar Nuevos Temas

Edita los arrays `topics` en los componentes para agregar nuevos temas del curso.

### Modificar Prompts

Los prompts de IA están en los archivos de API (`app/api/*/route.ts`). Puedes modificarlos para ajustar el comportamiento de la IA.

### Cambiar Modelo de IA

Para usar Gemini 2.0 Pro en lugar de Flash para tareas más complejas, cambia:

\`\`\`typescript
model: openrouter('google/gemini-2.0-pro-exp')
\`\`\`

## Soporte

Para problemas técnicos o preguntas sobre la implementación, revisa:

1. Los logs de la consola del navegador
2. Los logs de Vercel (si está desplegado)
3. La documentación de OpenRouter: https://openrouter.ai/docs

## Licencia

Este proyecto está diseñado específicamente para uso educativo con Chamilo LMS.
