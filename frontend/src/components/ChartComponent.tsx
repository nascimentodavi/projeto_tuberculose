import { LineChart,
    Line,
    ResponsiveContainer,
    CartesianAxis,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

interface ChartComponentProps {
    data: any[];
    type?: "line" | "bar";
    xKey: string,
    yKey: string,
    color?: string,
    title?: string,
}

export default function ChartComponent({data, xKey, yKey, color, title} : ChartComponentProps) {

    // VERIFICA SE EXISTE ALGUM DADO
    if(!data || data.length == 0) {
        return <p className="text-center mt-3 text-muted">No data available</p>;
    }

    return (
        <div>
            {title && <h5 className="text-center mb-3">{title}</h5>};

            <ResponsiveContainer width="100%" height="100%">

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />
                    
                    <XAxis dataKey={xKey} />
                    
                    <YAxis dataKey={yKey} />
                    
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey={yKey}
                        stroke={color}
                        strokeWidth={2}
                        dot={true}
                    />
                    
                </LineChart>
                
            </ResponsiveContainer>
        </div>
    );

}