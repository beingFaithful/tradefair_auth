export default function TestEnv() {
  return (
    <div>
      <h1>Environment Test</h1>
      <pre>
        MONGODB_URI: {process.env.MONGODB_URI ? '✅ SET' : '❌ MISSING'}
      </pre>
    </div>
  );
}