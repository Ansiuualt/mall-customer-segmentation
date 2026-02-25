import { useState, useEffect } from 'react'
import { Activity, Users, Settings, Search } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './index.css'

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard') // dashboard or predict

    return (
        <div className="container">
            <header className="app-header animate-fade-in">
                <h1 className="app-title gradient-text">Mall Customer Segmentation</h1>
                <p className="app-subtitle">
                    Advanced K-Means clustering analysis for identifying distinct customer personas and targeting profiles.
                </p>
            </header>

            <div className="flex-center animate-fade-in" style={{ marginBottom: '2rem', animationDelay: '0.1s' }}>
                <button
                    className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <Activity size={18} /> Cluster Overview
                </button>
                <button
                    className={`btn ${activeTab === 'predict' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('predict')}
                >
                    <Search size={18} /> Predict Segment
                </button>
            </div>

            <main className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {activeTab === 'dashboard' ? <Dashboard /> : <Predictor />}
            </main>
        </div>
    )
}

function Dashboard() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/clusters')
            .then(res => res.json())
            .then(d => {
                setData(d)
                setLoading(false)
            })
            .catch(e => {
                console.error("Make sure the backend is running", e)
                setLoading(false)
            })
    }, [])

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading clusters...</div>

    // Create scatter plot groupings by cluster
    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"]

    // Custom tooltip for scatter chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="glass-panel" style={{ padding: '1rem', minWidth: '150px' }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Cluster {data.Cluster}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Income: {data['Annual Income (k$)']}k$</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Spend: {data['Spending Score (1-100)']}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Age: {data.Age}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel">
            <h2>Cluster Analytics</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                Overview of the customer segments found by our model (Income vs Spending Score).
            </p>
            {data.length > 0 ? (
                <div style={{ width: '100%', height: '450px', marginTop: '2rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis type="number" dataKey="Annual Income (k$)" name="Income" unit="k$" stroke="var(--text-secondary)" />
                            <YAxis type="number" dataKey="Spending Score (1-100)" name="Score" stroke="var(--text-secondary)" />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            {[0, 1, 2, 3, 4, 5].map(clusterId => {
                                const clusterData = data.filter(d => d.Cluster === clusterId);
                                if (clusterData.length === 0) return null;
                                return (
                                    <Scatter
                                        key={clusterId}
                                        name={`Segment ${clusterId}`}
                                        data={clusterData}
                                        fill={colors[clusterId % colors.length]}
                                    />
                                );
                            })}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)' }}>
                    <Activity size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Unable to load cluster data. Is backend running?</p>
                </div>
            )}
        </div>
    )
}

function Predictor() {
    const [age, setAge] = useState('');
    const [income, setIncome] = useState('');
    const [score, setScore] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    age: parseInt(age),
                    annual_income: parseFloat(income),
                    spending_score: parseFloat(score)
                })
            });

            if (!response.ok) throw new Error('Prediction failed');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            alert("Error reaching the prediction API. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Predict Customer Segment</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', marginTop: '0.5rem' }}>
                Enter customer details to receive a real-time cluster assignment.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 30"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Annual Income (k$)</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 80"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Spending Score (1-100)</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 90"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Customer'}
                </button>
            </form>

            {result && (
                <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Prediction Result</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Cluster {result.cluster}</p>
                            <p style={{ color: 'var(--text-secondary)' }}>Persona: {result.segment_name}</p>
                        </div>
                        <Users size={40} style={{ color: 'var(--accent-primary)', opacity: 0.8 }} />
                    </div>
                </div>
            )}
        </div>
    )
}
