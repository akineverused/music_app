import { Card, Row, Col } from 'antd';

export default function Gallery({ songs }) {
    return (
        <Row gutter={[16, 16]}>
            {songs.map(song => (
                <Col key={song.index} span={6}>
                    <Card hoverable>
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                        <p style={{ color: '#888' }}>{song.genre}</p>
                        <p>❤️ {song.likes}</p>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}