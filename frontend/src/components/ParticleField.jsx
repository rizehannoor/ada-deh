import { useMemo } from "react";

export default function ParticleField({
  intensity = 28,
  variant = "default",
}) {
  const particles = useMemo(() => {
    return Array.from({ length: intensity }, (_, index) => ({
      id: index,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * -12,
      opacity: Math.random() * 0.45 + 0.1,
      drift: Math.random() * 80 - 40,
    }));
  }, [intensity]);

  return (
    <div
      className={`particle-field particle-${variant}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            "--drift": `${particle.drift}px`,
          }}
        />
      ))}
    </div>
  );
}