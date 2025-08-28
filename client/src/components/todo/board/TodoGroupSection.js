// src/components/todo/TodoGroupSection.jsx
export function TodoGroupSection({ title, children }) {
    return (
        <section style={{ marginBottom: 32 }}>
            <h2
                style={{
                    borderBottom: "1px solid #ccc",
                    fontSize: "14px",
                    paddingBottom: 4,
                    marginBottom: 12,
                }}
            >
                {title}
            </h2>
            {children}
        </section>
    );
}
