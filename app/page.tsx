"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import styles from "./JobPage.module.css";
import React from "react";

interface Job {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

const jobsData: Record<string, Job> = {
  "data-engineer": {
    title: "Data Analyst & Engineer",
    description: "Únete a nuestro equipo de datos y transforma información en decisiones estratégicas.",
    responsibilities: [
      "Diseñar y mantener pipelines ETL/ELT.",
      "Construir infraestructura de datos (cloud data warehouse, data lake).",
      "Implementar controles de calidad y monitoreo de datos.",
      "Analizar datos para decisiones de negocio y métricas clave.",
      "Crear dashboards y reportes para toda la empresa.",
    ],
    requirements: [
      "3+ años de experiencia en roles de datos.",
      "SQL avanzado, Python y cloud platforms (AWS/GCP/Azure).",
      "Experiencia en BI tools (Tableau, Power BI, Looker).",
      "Comunicación efectiva entre técnico y negocio.",
    ],
    benefits: ["Crecimiento profesional", "Proyectos desafiantes", "Ambiente dinámico"],
  },
  "sales-marketing-specialist": {
    title: "Sales and Marketing Specialist (Female)",
    description: "Participa en nuestras campañas y gestión de clientes, aportando creatividad y estrategia.",
    responsibilities: [
      "Gestionar comunicación inbound y outbound.",
      "Redacción de contenido para blogs y campañas.",
      "Administrar CRM y seguimientos en Monday.com.",
      "Creación de contenidos visuales en Canva.",
      "Apoyar campañas y distribución de contenido digital.",
    ],
    requirements: [
      "Fluidez en inglés y español (nivel nativo).",
      "Habilidades de comunicación y escritura excelentes.",
      "Experiencia en CRM y herramientas de marketing.",
      "Creatividad y capacidad de aprendizaje rápido.",
    ],
    benefits: ["Trabajo remoto", "Aprendizaje continuo", "Cultura de equipo positiva"],
  },
  "website-specialist": {
    title: "Website Specialist",
    description: "Apoya la configuración y optimización de cursos y membresías en plataformas digitales.",
    responsibilities: [
      "Subir y organizar cursos en System.io",
      "Configurar funnels de marketing y CRM",
      "Desarrollar sitios de membresía con acceso por niveles",
      "Organizar librerías de video",
      "Asesorar en integraciones y mejoras de plataforma",
    ],
    requirements: [
      "Experiencia con System.io, Podia o plataformas similares",
      "Conocimiento de CRM y marketing funnels",
      "Capacidad de gestión de contenido digital",
      "Organización y atención al detalle",
    ],
    benefits: ["Trabajo remoto", "Aprendizaje técnico", "Crecimiento profesional"],
  },
  "solution-integration-specialist": {
    title: "Solution Integrations Specialist",
    description: "Implementa soluciones técnicas y gestiona proyectos de infraestructura IT.",
    responsibilities: [
      "Contacto técnico principal para implementación de proyectos",
      "Documentación técnica y diagramas de red",
      "Configuración y mantenimiento de soluciones según especificaciones",
      "Entrenamiento de equipos internos",
      "Monitoreo y ajuste de proyectos para éxito",
    ],
    requirements: [
      "5+ años de experiencia en infraestructura IT",
      "Certificaciones Microsoft 365, AZ-104, AZ-800/801, Fortinet",
      "Bilingüe inglés-francés",
      "Título técnico en IT o ingeniería",
    ],
    benefits: ["Desarrollo profesional", "Salario competitivo", "Exposición a proyectos avanzados"],
  },
  "digital-advertising-specialist": {
    title: "Digital Advertising Specialist",
    description: "Gestiona y optimiza campañas digitales en diversas plataformas publicitarias.",
    responsibilities: [
      "Crear y optimizar campañas en Google, Meta, YouTube y LinkedIn",
      "Analizar métricas y generar reportes de rendimiento",
      "Optimizar segmentación, testing A/B y estrategias de puja",
      "Apoyo en desarrollo web y optimización de clientes",
    ],
    requirements: [
      "3+ años de experiencia en campañas digitales",
      "Manejo de plataformas publicitarias y herramientas analíticas",
      "Inglés fluido",
      "Conocimiento en Excel y software de reporting",
    ],
    benefits: ["Trabajo remoto", "Crecimiento en marketing digital", "Aprendizaje de nuevas plataformas"],
  },
  "system-administrator": {
    title: "System Administrator",
    description: "Mantén y optimiza nuestra infraestructura IT, asegurando seguridad y soporte técnico.",
    responsibilities: [
      "Monitorear hardware, servidores y procesos",
      "Instalar, configurar y actualizar sistemas operativos y aplicaciones",
      "Gestionar redes, firewalls y VPNs",
      "Implementar medidas de seguridad y políticas IT",
      "Gestionar backups y recuperación de desastres",
      "Soporte técnico a usuarios",
      "Mantener documentación de sistemas",
      "Aplicar parches y actualizaciones",
      "Planificación de capacidad y rendimiento",
      "Colaborar con equipo de IT y seguridad",
    ],
    requirements: [
      "8+ años de experiencia en infraestructura IT",
      "Certificaciones Microsoft 365, AZ-800/801, AZ-104, Fortinet",
      "Experiencia en Linux, Windows Server, MS SQL, PowerShell/Bash",
      "Inglés y francés fluido",
      "Título técnico en Ciencias de la Computación o afín",
    ],
    benefits: ["Crecimiento profesional", "Salario atractivo", "Trabajo con expertos del sector IT"],
  },
};

export default function JobPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const job = jobsData[jobId];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!job) return;

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("position", job.title);
      if (formData.cv) dataToSend.append("cv", formData.cv);

      const response = await fetch("/api/submit-application", {
        method: "POST",
        body: dataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "✅ Tu aplicación ha sido enviada con éxito!");
        setFormData({ name: "", email: "", phone: "", cv: null });
      } else {
        alert(result.error || "❌ Error al enviar la aplicación");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("❌ Error de red: No se pudo conectar con el servidor.");
    }
  };

  if (!job) {
    return (
      <div className={styles.notFound}>
        <h1>Puesto no encontrado</h1>
        <Link href="/">
          <button>Volver al Inicio</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>{job.title}</h1>
        <p>{job.description}</p>
      </section>

      <section className={styles.quickInfo}>
        <div>
          Tipo de trabajo: <span style={{ fontWeight: "normal" }}>Tiempo completo</span>
        </div>
        <div>
          Ubicación: <span style={{ fontWeight: "normal" }}>Remoto</span>
        </div>
        <Link href="#apply">
          <button>Aplica Ahora</button>
        </Link>
      </section>

      <section className={styles.cards}>
        <div className={styles.card}>
          <h2>Responsabilidades</h2>
          <ul>
            {job.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </div>
        <div className={styles.card}>
          <h2>Requisitos</h2>
          <ul>
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
        <div className={styles.card}>
          <h2>Beneficios</h2>
          <ul>
            {job.benefits.map((ben, idx) => (
              <li key={idx}>{ben}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply">
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Aplica Ahora</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nombre Completo" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Teléfono" onChange={handleChange} required />
          <input type="file" name="cv" onChange={handleChange} />
          <button type="submit">Enviar Aplicación</button>
        </form>
      </section>
    </div>
  );
}

