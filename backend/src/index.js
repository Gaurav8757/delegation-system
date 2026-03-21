import app from "./app/app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", (error) => {
    if (error) {
        console.log(`⚠️ Server is not running on http://localhost:${PORT} !! Worker 🔄 PID:${process.pid}`);
        process.exit(1);
    }
    console.log(`🚀 Server is running on http://localhost:${PORT} !! Worker 🔄 PID:${process.pid}`);

    if (process.env.NODE_ENV === "development") {
        console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    }
});