import styles from '@/styles/loading-dots.module.css';

interface LoadingDotsProps {
  color: string;
  style?: string;
  className?: string;
}

const LoadingDots = ({
  color,
  style = 'small',
  className,
}: LoadingDotsProps) => {
  return (
    <span
      className={`${className} ${
        style === 'small' ? styles.loading2 : styles.loading
      }`}
    >
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

export default LoadingDots;

LoadingDots.defaultProps = {
  style: 'small',
};
