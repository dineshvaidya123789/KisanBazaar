import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PriceTrendChart = ({ data, cropName }) => {
    if (!data || data.length === 0) return null;

    return (
        <div style={{ width: '100%', height: 300, backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#555' }}>
                Price Trend: {cropName} (7 Days)
            </h4>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 12 }}
                        unit="₹"
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}
                        formatter={(value) => [`₹${value}`, 'Price']}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="var(--color-primary)"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                    {/* Visual marker for Today - Safer Check */}
                    {data.length > 4 && (
                        <ReferenceLine x={data[4].date} stroke="red" strokeDasharray="3 3" label="Today" />
                    )}
                </LineChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '50%' }}></span>
                    Historical Data
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', border: '1px dashed red' }}></span>
                    Forecast (Estimated)
                </span>
            </div>
        </div>
    );
};

export default PriceTrendChart;
