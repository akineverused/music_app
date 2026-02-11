import {useEffect, useRef, useState} from 'react';
import {
    Table,
    Layout,
    InputNumber,
    Slider,
    Segmented,
    Row,
    Col, Button,
} from 'antd';
import axios from 'axios';
import {RightOutlined, DownOutlined, ReloadOutlined} from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';
import SongDetails from './components/SongDetails/SongDetails.jsx';

const { Content } = Layout;
const API = ""


function App() {
    const [data, setData] = useState([]);
    const [galleryData, setGalleryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);
    const [page, setPage] = useState(1);
    const [galleryPage, setGalleryPage] = useState(1);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [seed, setSeed] = useState(42);
    const [likes, setLikes] = useState(3.7);
    const [view, setView] = useState('table');
    const [galleryReady, setGalleryReady] = useState(false);
    const [lang, setLang] = useState('en');

    const generateRandomSeed = () => {
        const randomSeed = Math.floor(
            Math.random() * Number.MAX_SAFE_INTEGER
        );
        setSeed(randomSeed);
    };

    useEffect(() => {
        if (view !== 'table') return;
        setLoading(true);
        axios.get('http://localhost:3001/songs', {
                params: {page, seed, likes, lang,},
            })
            .then(res => setData(res.data.songs))
            .finally(() => setLoading(false));
        setExpandedRowKeys([]);
    }, [page, seed, likes, view, lang]);

    useEffect(() => {
        if (view !== 'gallery') return;
        axios.get('http://localhost:3001/songs', {
                params: {page, seed, likes, lang,},
            })
            .then(res => {
                setGalleryData(prev =>
                    galleryPage === 1
                        ? res.data.songs
                        : [...prev, ...res.data.songs]
                );
                if (galleryPage === 1) {
                    setGalleryReady(true);
                }
            });
        setExpandedRowKeys([]);
    }, [galleryPage, seed, likes, view, lang]);

    useEffect(() => {
        if (view === 'gallery') {
            setGalleryReady(false);
            setGalleryData([]);
            setGalleryPage(1);
            window.scrollTo(0, 0);
        }
        setPage(1);
        setExpandedRowKeys([]);
    }, [seed, likes, view]);

    useEffect(() => {
        if (view !== 'gallery' || !galleryReady) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setGalleryPage(p => p + 1);
                }
            },
            {
                root: null,
                rootMargin: '10px',
                threshold: 0,
            }
        );
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => observer.disconnect();
    }, [view, galleryReady]);

    const columns = [
        { title: '#', dataIndex: 'index', width: 60 },
        { title: 'Title', dataIndex: 'title' },
        { title: 'Artist', dataIndex: 'artist' },
        { title: 'Album', dataIndex: 'album' },
        { title: 'Genre', dataIndex: 'genre' },
        { title: 'Likes', dataIndex: 'likes', width: 80 },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content>
                <Row style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Col>
                        <Segmented
                            options={[
                                { label: 'EN', value: 'en' },
                                { label: 'DE', value: 'de' },
                            ]}
                            value={lang}
                            onChange={setLang}
                        />
                    </Col>
                    <Col style={{display: "flex", gap: 5, alignItems: "center"}}>
                        <b>Seed</b>
                        <InputNumber value={seed} onChange={v => setSeed(v)} />
                        <Button
                            icon={"🎲"}
                            controls={false}
                            onClick={generateRandomSeed}
                            title="Random seed"
                        />
                    </Col>
                    <Col>
                        <b>Likes</b>
                        <Slider
                            min={0}
                            max={10}
                            step={0.1}
                            style={{ width: 200 }}
                            value={likes}
                            onChange={setLikes}
                        />
                    </Col>
                    <Col>
                        <Segmented
                            options={[
                                { label: 'Table', value: 'table' },
                                { label: 'Gallery', value: 'gallery' },
                            ]}
                            value={view}
                            onChange={setView}
                        />
                    </Col>
                </Row>
                <Table
                    rowKey="index"
                    columns={columns}
                    loading={loading}
                    dataSource={view === 'table' ? data : galleryData}
                    pagination={
                        view === 'table'
                            ? {
                                current: page,
                                pageSize: 10,
                                total: 100,
                                onChange: setPage,
                                showSizeChanger: false,
                            }
                            : false
                    }
                    onRow={(record) => ({
                        onClick: () => {
                            const isExpanded = expandedRowKeys.includes(record.index);
                            setExpandedRowKeys(isExpanded ? [] : [record.index]);
                        },
                    })}
                    expandable={{
                        expandedRowKeys,
                        onExpand: (expanded, record) =>
                            setExpandedRowKeys(expanded ? [record.index] : []),
                        expandIcon: ({ expanded, onExpand, record }) =>
                            expanded ? (
                                <DownOutlined onClick={e => onExpand(record, e)} />
                            ) : (
                                <RightOutlined onClick={e => onExpand(record, e)} />
                            ),
                        expandedRowRender: record => (
                            <AnimatePresence mode="wait">
                                {expandedRowKeys.includes(record.index) && (
                                    <motion.div
                                        key={record.index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <SongDetails song={record} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        ),
                    }}
                />
                {view === 'gallery' && (
                    <div
                        ref={loaderRef}
                        style={{ height: 1 }}
                    />
                )}
            </Content>
        </Layout>
    );
}

export default App;