function DailyProgress({ repeated, dailyLimit }) {
  const progressPercent = Math.min((repeated / dailyLimit) * 100, 100);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ background: '#eee', borderRadius: '8px', overflow: 'hidden', height: '20px' }}>
        <div
          style={{
            width: `${progressPercent}%`,
            background: '#4caf50',
            height: '100%',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p>{repeated} of {dailyLimit} words repeated today</p>
    </div>
  );
}

export default DailyProgress;
