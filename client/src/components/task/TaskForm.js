import React from "react";

export const TaskForm = ({ formData, onChange, onSubmit, files, onFileChange, onFileDelete }) => {
    return (
        <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}
        >
            <input
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="タイトル"
                required
                style={{ width: "30%" }}
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="内容"
                rows={3}
                style={{ width: "30%" }}
            />
            <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={onChange}
                required
                style={{ width: "fit-content" }}
            />

            {files && files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "30%" }}>
                    {files.map((f, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: "#f9f9f9",
                                padding: "4px 8px",
                                borderRadius: "4px"
                            }}
                        >
                            <span>📎 {f.name}</span>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => onFileDelete(i)}
                                style={{ backgroundColor: "#e5e7eb", color: "#000", padding: "2px 8px" }}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={(e) => onFileChange(Array.from(e.target.files))}
                multiple
                style={{ width: "30%" }}
            />

            <button className="btn" type="submit" style={{ width: "fit-content", alignSelf: "start" }}>
                登録する
            </button>
        </form>
    );
};
