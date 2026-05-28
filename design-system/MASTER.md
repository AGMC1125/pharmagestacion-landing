# Design System: Desde el Primer Latido
> Generado con UI/UX Pro Max Skill · 2026

## Decisión de Diseño
La skill generó base "Medical Clean" como punto de partida. Para la versión futurista/3D
combinamos ese foundation con los estilos **Aurora UI + Motion-Driven** también consultados.

---

## Paleta de Colores (base médica, adaptada al proyecto)
El proyecto YA tiene una paleta de identidad definida (rose/mauve médico). La conservamos
y la enriquecemos con los efectos de Aurora UI para el look futurista.

| Rol | Hex actual | Hex UI-Pro base |
|-----|-----------|-----------------|
| Primary | #A31545 | #0EA5E9 |
| Secondary | #6B3FA0 | #38BDF8 |
| Accent | #F06292 | #F97316 |
| Background | #FFF8FB | #F0F9FF |
| Text | #1C1B29 | #0C4A6E |

**Decisión:** Mantener paleta rose/mauve del proyecto (identidad ya establecida)
y agregar Aurora Evolved como efecto de fondo en hero y secciones clave.

---

## Tipografía Recomendada
- **Headings:** `Figtree` (médico, limpio, profesional — reemplaza Nunito)
- **Body:** `Noto Sans` (accesible, legible, healthcare)
- **Fuente actual:** Nunito + Inter → migrar a Figtree + Inter (Inter queda igual)

```css
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
```

---

## Patrón de Página
**Scroll-Triggered Storytelling** — Narrativa progresiva:
1. Intro hook (hero impactante)
2. Capítulo problema (datos, estadísticas)
3. Capítulo viaje (desarrollo, farmacología)
4. Capítulo solución (papel del QFB)
5. CTA climax (equipo, referencias)

---

## Efectos / Tecnologías para Fase 2

### Para todas las páginas — GSAP ScrollTrigger
- Animaciones de entrada por scroll (más cinematográficas que el IntersectionObserver actual)
- Contadores animados al scroll
- Parallax en 3 capas en el hero

### Para index.html — Aurora / Gradient Mesh fondo
- CSS animated mesh gradient en el hero
- Reemplaza el background sólido actual

### Para bebe.html — model-viewer o Spline embed
- Bebé 3D realista con Google model-viewer
- Modelo GLB anatómico de Sketchfab (licencia CC)

### Para desarrollo.html — Diagrama placentario 3D
- Three.js con esferas animadas en lugar del SVG plano actual

---

## Anti-patrones a evitar (según UI-Pro)
- ❌ Navegación compleja (la actual es simple, OK)
- ❌ Info de contacto oculta (footer tiene todo, OK)
- ❌ Emojis como íconos (ya corregido ✓)
- ❌ Gradientes purple/pink de IA (los usamos pero con propósito médico, OK)

---

## Checklist Pre-entrega
- [x] No emojis (Lucide icons instalados)
- [ ] cursor-pointer en todos los clickables
- [ ] Hover states 150-300ms
- [ ] Contraste texto 4.5:1 mínimo
- [ ] Focus states visibles
- [ ] prefers-reduced-motion respetado
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Tipografía Figtree + Inter
- [ ] GSAP ScrollTrigger instalado
- [ ] Bebé 3D (model-viewer o Spline)
