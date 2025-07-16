import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import { BlogPost } from '../types';

const BlogPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get('/blog/');
                setPosts(response.data);
            } catch (err) {
                setError('Failed to load blog posts.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-white flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black">
            <Header />
            <main className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                        The Applaude Blog
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <Link to={`/blog/${post.id}`} key={post.id}>
                                <Card className="overflow-hidden h-full flex flex-col group transform hover:-translate-y-2 transition-transform duration-300">
                                    <img src={post.main_image_url || 'https://via.placeholder.com/400x200'} alt={post.title} className="w-full h-48 object-cover" />
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h2 className="text-2xl font-bold text-black mb-2 group-hover:text-ion-blue transition-colors">{post.title}</h2>
                                        <p className="text-gray-600 line-clamp-3 flex-grow">{post.content}</p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            <span>By {post.author?.username || 'Applaude Team'}</span>
                                            <span className="mx-2">&bull;</span>
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPage;
