// src/components/PageHeader.js
import Header from "./Header";

function PageHeader({ onOpenNameList }) {
    return (
        <>
            <Header onOpenNameList={onOpenNameList} />
            <h1>📝 朝の健康チェック</h1>
        </>
    );
}

export default PageHeader;
