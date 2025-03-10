// Инициализация Vue приложения
const app = Vue.createApp({
  data() {
    return {
      name: "stafilakok",
      title: "Разработчик",
      about:
        "Я увлеченный разработчик программного обеспечения. Специализируюсь на веб-разработке и создании приложений, используя различные технологии. Постоянно развиваюсь в профессиональной сфере, что помогает мне достигать высоких результатов в работе.",
      skills: [
        { name: "Python", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "HTML/CSS", level: 95 },
        { name: "Vue.js", level: 75 },
        { name: "React", level: 70 },
        { name: "Разработка API", level: 80 },
        { name: "Развертывание приложений", level: 85 },
      ],
      contacts: [
        { type: "Email", value: "mops707@gmail.com" },
        { type: "GitHub", value: "github.com/stafilakok" },
      ],
      dnaSymbols: [
        "{ }",
        "< >",
        "[ ]",
        "( )",
        "/* */",
        "// //",
        "# #",
        "$ $",
        "% %",
        "= =",
        "? ?",
        ". .",
        ": :",
        "; ;",
        "+ +",
        "- -",
        "* *",
        "! !",
        "@ @",
      ],
    };
  },
  mounted() {
    this.initDnaAnimation();
    this.animateSkillBars();
    this.setSkillCardAnimationDelay();
  },
  methods: {
    initDnaAnimation() {
      const container = this.$refs.dnaContainer;
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      // Параметры ДНК - уменьшаем количество точек для повышения производительности
      const dnaStrands = 2;
      const pointsPerStrand = 50; // Уменьшаем количество точек для лучшей производительности
      const dnaWidth = width * 0.85;
      const dnaHeight = height * 0.85;
      const centerX = width / 2;
      const centerY = height / 2;

      // Поворот на 45 градусов
      const rotationAngle = 45 * (Math.PI / 180);

      // Контейнер для ДНК с поворотом
      container.style.transform = `rotate(${rotationAngle}rad)`;

      // Создаем точки для каждой нити ДНК
      const dnaPoints = [];

      // Предварительно рассчитываем позиции для повышения производительности
      const positions = [];

      for (let i = 0; i < pointsPerStrand; i++) {
        positions[i] = (i / pointsPerStrand) * dnaHeight - dnaHeight / 2;
      }

      for (let strand = 0; strand < dnaStrands; strand++) {
        dnaPoints[strand] = [];

        for (let i = 0; i < pointsPerStrand; i++) {
          const point = document.createElement("div");
          point.className = "dna-point";
          point.style.position = "absolute";
          point.style.color = "rgba(76, 175, 80, 0.9)";
          point.style.fontSize = "16px";
          point.style.fontFamily = "var(--font-mono)";
          point.style.textShadow = "0 0 10px rgba(76, 175, 80, 0.8)";
          // Используем hardware accelerated свойства
          point.style.transform = "translate3d(0, 0, 0)";
          point.style.willChange = "transform, opacity";
          point.innerText = this.getRandomSymbol();

          // Начальное положение
          point.style.left = `${centerX}px`;
          point.style.top = `${centerY}px`;

          container.appendChild(point);
          dnaPoints[strand].push(point);

          // Меняем символы с интервалом, реже обновляем для лучшей производительности
          if (i % 2 === 0) {
            // Только для каждой второй точки
            setInterval(() => {
              point.innerText = this.getRandomSymbol();

              // Случайные эффекты для оживления, но реже
              if (Math.random() > 0.92) {
                point.style.color = "rgba(255, 255, 255, 0.95)";
                point.style.textShadow =
                  "0 0 15px rgba(255, 255, 255, 0.8), 0 0 10px rgba(76, 175, 80, 0.9)";
                setTimeout(() => {
                  point.style.color = "rgba(76, 175, 80, 0.9)";
                  point.style.textShadow = "0 0 10px rgba(76, 175, 80, 0.8)";
                }, 400);
              }
            }, 3000 + Math.random() * 4000);
          }
        }
      }

      // Анимируем ДНК
      let angle = 0;
      let lastTime = 0;

      const animate = (currentTime) => {
        // Рассчитываем дельту времени для плавной анимации независимо от FPS
        if (!lastTime) lastTime = currentTime;
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Увеличиваем скорость анимации
        angle += 0.025 * (deltaTime / 16); // Нормализуем по 60fps

        for (let strand = 0; strand < dnaStrands; strand++) {
          const strandOffset = strand * Math.PI;

          for (let i = 0; i < pointsPerStrand; i++) {
            const verticalPos = positions[i];
            // Упрощаем вычисления, чтобы снизить нагрузку на CPU
            const phase = (verticalPos / dnaHeight) * Math.PI * 6 + angle;

            const xWave = Math.sin(phase + strandOffset) * (dnaWidth / 4);

            const x = centerX + xWave;
            const y = centerY + verticalPos;

            // Упрощаем эффект 3D для повышения производительности
            const scaleFactor = 1 + Math.sin(phase + strandOffset) * 0.15;

            const point = dnaPoints[strand][i];
            // Используем translate3d для аппаратного ускорения
            point.style.transform = `translate3d(${x - centerX}px, ${
              y - centerY
            }px, 0) scale(${scaleFactor})`;

            // Соединения между нитями (перемычки), но только для каждой третьей точки
            if (strand === 0 && i % 3 === 0) {
              const connectorPoint = dnaPoints[1][i];
              const opacity = 0.5 + Math.sin(phase) * 0.5;
              point.style.opacity = opacity.toString();
              connectorPoint.style.opacity = opacity.toString();
            }
          }
        }

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    },
    getRandomSymbol() {
      return this.dnaSymbols[
        Math.floor(Math.random() * this.dnaSymbols.length)
      ];
    },
    animateSkillBars() {
      // Анимация прогресса навыков при прокрутке
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const skillCards = document.querySelectorAll(".skill-card");
              skillCards.forEach((card, index) => {
                setTimeout(() => {
                  const progressBar = card.querySelector(".skill-progress");
                  const skillLevel = this.skills[index].level + "%";
                  progressBar.style.width = skillLevel;
                }, index * 150);
              });
            }
          });
        },
        { threshold: 0.1 }
      );

      const skillsSection = document.querySelector(".skills");
      if (skillsSection) {
        observer.observe(skillsSection);
      }
    },
    setSkillCardAnimationDelay() {
      // Устанавливаем задержку анимации для каждой карточки навыка
      setTimeout(() => {
        const skillCards = document.querySelectorAll(".skill-card");
        skillCards.forEach((card, index) => {
          card.style.setProperty("--index", index);
        });
      }, 100);
    },
  },
});

// Запуск приложения
app.mount("#app");

// Добавление стилей для точек ДНК
const style = document.createElement("style");
style.innerHTML = `
    .dna-point {
        position: absolute;
        font-family: var(--font-mono);
        transform-origin: center;
        filter: drop-shadow(0 0 2px rgba(76, 175, 80, 0.5));
        left: 50%;
        top: 50%;
        will-change: transform, opacity;
        backface-visibility: hidden;
    }
    
    .dna-animation {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        transform-origin: center;
        will-change: transform;
    }
`;
document.head.appendChild(style);
