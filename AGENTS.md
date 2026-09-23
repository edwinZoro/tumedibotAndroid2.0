# AGENTS.md - TuMedibot 2.0 Project Knowledge Base & Agent Guidelines

## 📋 Descripción del Proyecto / Project Overview
**TuMedibot 2.0** es una plataforma de salud digital, gestión médica y telemedicina desarrollada en Laravel 13 e Inertia.js (React 19 + TypeScript). Permite la gestión de citas médicas, videollamadas en tiempo real mediante Jitsi, monitoreo de datos médicos IoMT (Internet of Medical Things), firma digital, generación de recetas médicas en PDF, control de consentimientos informados y procesamiento de pagos/suscripciones.

---

## 🛠️ Stack Tecnológico (Technology Stack)

### Backend
- **Framework**: Laravel 13 (PHP 8.3+)
- **Autenticación**: Laravel Fortify & `@laravel/passkeys` (Passkeys / WebAuthn)
- **Autorización & Roles**: Spatie `laravel-permission` (Médicos, Pacientes, Admin)
- **Generación de Reportes / Recetas**: Barryvdh `laravel-dompdf`
- **Testing**: Pest PHP (`pestphp/pest`) & PHPUnit
- **Sanitización de Contenido**: Mews `purifier` & HTMLPurifier
- **Integración Inertia**: `inertiajs/inertia-laravel` & `@laravel/wayfinder`

### Frontend
- **Framework UI**: React 19 + TypeScript
- **Navegación / Monolito**: Inertia.js (v3) + Vite
- **Estilos**: Tailwind CSS (v4) + Radix UI / Shadcn UI + `tw-animate-css`
- **Iconos**: Lucide React (`lucide-react`)
- **Telemedicina**: `@jitsi/react-sdk` (Videollamadas integradas)
- **Firma Digital**: `react-signature-canvas`
- **Editor de Texto Enriquecido**: TipTap (`@tiptap/react`)
- **Gráficos & Vitales IoMT**: Recharts (`recharts`)
- **Notificaciones / Toast**: Sonner (`sonner`)
- **Formularios & Validación**: React Hook Form (`react-hook-form`) + Zod (`zod`)

---

## 🏗️ Arquitectura del Proyecto

```
tumedibot2.0/
├── app/
│   ├── Http/
│   │   ├── Controllers/    # Controladores de Inertia y API
│   │   └── Middleware/     # Middlewares de autenticación, roles y seguridad
│   ├── Models/             # Modelos Eloquent (29+ entidades del dominio)
│   └── Providers/          # Service Providers de Laravel
├── database/
│   ├── factories/          # Factorías para pruebas (Faker)
│   ├── migrations/         # Migraciones de la base de datos
│   └── seeders/            # Datos semilla iniciales
├── resources/
│   ├── js/
│   │   ├── components/     # Componentes reutilizables Shadcn / UI / Layouts
│   │   ├── layouts/        # Layouts principales (AppLayout, AuthLayout)
│   │   ├── pages/          # Páginas Inertia:
│   │   │   ├── Paciente/   # Vistas de pacientes (IoMT, citas, historial)
│   │   │   ├── medicos/    # Vistas de médicos y panel médico
│   │   │   ├── medicalfoo/ # Módulos de consulta y video
│   │   │   ├── admin/      # Panel de administración
│   │   │   ├── auth/       # Login, registro y autenticación
│   │   │   ├── billing/    # Facturación y pagos
│   │   │   └── welcome.tsx # Landing page principal
│   │   └── types/          # Tipados globales TypeScript
│   └── css/                # Configuración de Tailwind CSS
├── routes/
│   ├── web.php             # Rutas principales de la aplicación
│   ├── settings.php        # Rutas de perfil y configuración
│   └── console.php         # Comandos de consola
├── tests/                  # Pruebas automatizadas con Pest PHP
└── AGENTS.md               # Este archivo de guía para agentes AI
```

---

## 🗄️ Modelo de Datos y Entidades

| Modelo | Descripción |
| :--- | :--- |
| **`User`** | Autenticación de usuario, credenciales, email y roles Spatie. |
| **`Paciente`** | Datos personales, información médica y de emergencia del paciente. |
| **`Medico`** | Perfil profesional, especialidad, número colegiado y tarifas del médico. |
| **`Especialidades`** | Catálogo de especialidades médicas disponibles. |
| **`Cita` / `CitaPaciente`** | Agendamiento, estado y consulta de citas médicas (presenciales/virtuales). |
| **`VideoCall`** | Registros y parámetros de las salas de videollamada Jitsi. |
| **`HistorialPaciente`** | Registros de antecedentes, diagnósticos y evolución clínica. |
| **`IoMTData`** | Telemetría de dispositivos médicos conectados (presión, glucosa, ritmo cardíaco, etc.). |
| **`Receta`** | Prescripción médica emitida por el doctor (exportable en PDF con DomPDF). |
| **`Medicamento`** | Catálogo de medicamentos y posología. |
| **`RecordatorioMedicamento`** | Alarmas y seguimiento de tomas para pacientes. |
| **`Firma`** | Firma manuscrita digitalizada del médico para recetas y documentos legales. |
| **`ConsentLog`** | Auditoría y registro de consentimientos informados firmados. |
| **`Factura` / `Payment` / `ReportePago`** | Transacciones financieras, cobro de servicios y reportes. |
| **`MedicoSaldo` / `Retiro`** | Gestión de saldo acumulado y solicitudes de retiro para médicos. |

---

## 🚀 Scripts y Comandos Principales

```bash
# Desarrollo simultáneo (Laravel Serve + Queue + Pail + Vite)
composer run dev

# Compilación de activos frontend para producción
npm run build

# Análisis y formateo de código PHP (Laravel Pint)
composer run lint

# Linter de TypeScript / React (ESLint)
npm run lint

# Chequeo de tipos TypeScript (sin emitir build)
npm run types:check

# Formateo con Prettier
npm run format

# Ejecutar suite de tests (Pest PHP)
composer run test
```

---

## 🤖 Reglas de Ejecución para Agentes AI (Agent Workflow Rules)

1. **Integridad de Inertia & React 19**:
   - Toda nueva ruta que renderice una vista debe usar `Inertia::render('NombrePagina', $data)`.
   - Las páginas en `resources/js/pages` deben mantener tipado TypeScript estricto en sus props.

2. **Componentes UI & Estilos**:
   - Priorizar componentes reutilizables en `resources/js/components/ui/` (Radix UI / Shadcn UI).
   - Utilizar clases de Tailwind CSS v4 para mantener la consistencia estética moderna y responsive.

3. **Manejo de Formularios y Validación**:
   - Usar `FormRequest` en Laravel para validación backend.
   - Usar `useForm` de `@inertiajs/react` o `react-hook-form` con esquemas `zod` en el frontend.

4. **Seguridad Médica y Privacidad**:
   - Verificar siempre permisos de roles Spatie antes de exponer datos médicos sensibles.
   - Sanitizar entradas HTML/RichText antes de persistirlas o renderizarlas.

5. **Verificación Continua**:
   - Al realizar cambios en el frontend, ejecutar `npm run types:check` para verificar que no existan errores de compilación TypeScript.
   - Al realizar cambios en el backend, asegurar que el código cumpla con los estándares de Laravel Pint (`composer run lint`).
