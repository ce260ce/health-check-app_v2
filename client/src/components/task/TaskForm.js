// components/TaskForm.js
import React from "react";

export const TaskForm = ({
    formData,
    onChange,
    onSubmit,
    files,
    onFileChange,
    onFileDelete,
}) => {
    return (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "4em", textAlign: "right" }}>開始日：</span>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={onChange}
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "4em", textAlign: "right" }}>納期：</span>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={onChange}
                    required
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                {/* アップロードボタン */}
                <label
                    htmlFor="file-upload"
                    style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        backgroundColor: "#e5e7eb",
                        color: "#000",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "normal",
                        width: "fit-content"
                    }}
                >
                    ファイルを選択
                </label>
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={(e) => onFileChange(Array.from(e.target.files))}
                    style={{ display: "none" }}
                />

                {/* アップロード済ファイル一覧 */}
                {files && files.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {files.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    backgroundColor: "#f1f1f1",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                }}
                            >
                                <span style={{ fontSize: "0.85rem" }}>📎 {f.name}</span>
                                <button
                                    type="button"
                                    onClick={() => onFileDelete(i)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#d00",
                                        cursor: "pointer",
                                        fontSize: "1rem"
                                    }}
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>



            <button
                type="submit"
                style={{
                    width: "fit-content",
                    alignSelf: "flex-start", // 左寄せ
                    padding: "8px 16px",      // 任意でボタンの中身を見やすく
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                登録する
            </button>

        </form>
    );
};
