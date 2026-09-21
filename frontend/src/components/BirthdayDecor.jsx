import { motion } from "framer-motion";

const balloons = [
  {
    left: "7%",
    top: "18%",
    size: 52,
    delay: 0,
  },
  {
    left: "88%",
    top: "20%",
    size: 42,
    delay: 0.5,
  },
  {
    left: "92%",
    top: "67%",
    size: 34,
    delay: 1,
  },
];

const confetti = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  left: Math.random() * 100,
  delay: Math.random() * 0.8,
  duration: 2.2 + Math.random() * 2,
  rotate: Math.random() * 360,
}));

export default function BirthdayDecor({ burst = false }) {
  return (
    <div className="birthday-decor" aria-hidden="true">
      <div className="candle candle-one">
        <span className="candle-flame" />
        <span className="candle-body" />
      </div>

      <div className="candle candle-two">
        <span className="candle-flame" />
        <span className="candle-body" />
      </div>

      {balloons.map((balloon) => (
        <motion.div
          key={`${balloon.left}-${balloon.top}`}
          className="balloon"
          style={{
            left: balloon.left,
            top: balloon.top,
            width: balloon.size,
            height: balloon.size * 1.25,
          }}
          initial={{
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            opacity: 0.42,
            scale: 1,
            y: [0, -12, 0],
          }}
          transition={{
            opacity: {
              delay: 0.8 + balloon.delay,
              duration: 1,
            },
            scale: {
              delay: 0.8 + balloon.delay,
              duration: 1,
            },
            y: {
              delay: 1.5 + balloon.delay,
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <span className="balloon-knot" />
        </motion.div>
      ))}

      {confetti.map((item) => (
        <motion.span
          key={item.id}
          className="confetti"
          style={{
            left: `${item.left}%`,
          }}
          initial={{
            opacity: 0,
            y: "-5vh",
            rotate: item.rotate,
          }}
          animate={
            burst
              ? {
                  opacity: [0, 0.9, 0.2],
                  y: ["-5vh", "35vh", "78vh"],
                  rotate: [
                    item.rotate,
                    item.rotate + 180,
                    item.rotate + 360,
                  ],
                }
              : {
                  opacity: 0,
                }
          }
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}