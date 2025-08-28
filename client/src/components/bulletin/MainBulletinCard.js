import { useNavigate } from 'react-router-dom';

export const MainBulletinCard = ({ bulletin, userName, onMarkAsRead }) => {
  const navigate = useNavigate();
  const MAX_LENGTH = 200;

  const isLong = bulletin.description.length > MAX_LENGTH;
  const previewText = isLong
    ? bulletin.description.slice(0, MAX_LENGTH) + '…'
    : bulletin.description;

  const handleClick = () => {
    onMarkAsRead(bulletin._id, userName, true);
  };

  const handleDetailClick = () => {
    navigate(`/bulletin?name=${encodeURIComponent(userName)}`);
  };

  const shortenUrl = (url) => {
    try {
      const { hostname } = new URL(url);
      return `${hostname}/...`;
    } catch {
      return url;
    }
  };

  const linkify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', wordBreak: 'break-word' }}
        >
          {shortenUrl(part)}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        minHeight: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      <h4 style={{ marginBottom: 8 }}>{bulletin.title}</h4>

      <p style={{ whiteSpace: 'pre-wrap', marginBottom: 8 }}>
        {linkify(previewText)}
      </p>

      {isLong && (
        <button
          onClick={handleDetailClick}
          style={{ fontSize: '0.85rem', marginBottom: 8, alignSelf: 'flex-start' }}
        >
          📄 詳細表示
        </button>
      )}

      {bulletin.files?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>添付ファイル:</strong>
          <ul style={{ paddingLeft: 20 }}>
            {bulletin.files.map((f, i) => (
              <li key={i}>
                <a href={f.url} target="_blank" rel="noopener noreferrer">
                  {f.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleClick} style={{ marginTop: 'auto' }}>
        👀見た
      </button>
    </div>
  );
};
