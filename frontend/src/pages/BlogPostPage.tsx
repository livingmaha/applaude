import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { BlogPost } from '../types';

const BlogPostPage = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/blog/${id}/`);
                setPost(response.data);
            } catch (err) {
                setError('Blog post not found or an error occurred.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-quantum-black flex items-center justify-center text-soft-white">Loading post...</div>;
    }

    if (error || !post) {
        return <div className="min-h-screen bg-quantum-black flex items-center justify-center text-solar-orange">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-quantum-black text-soft-white">
            <Header />
            <main className="py-24 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">
                    <Link to="/blog" className="text-ion-blue hover:underline mb-8 inline-block">&larr; Back to Blog</Link>
                    <h1 className="text-4xl md:text-6xl font-bold text-soft-white mb-4">{post.title}</h1>
                    <div className="text-gray-400 mb-8">
                        <span>By {post.author?.username || 'Applause Team'}</span>
                        <span className="mx-2">&bull;</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    {post.main_image_url && (
                        <img src={post.main_image_url} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-8" />
                    )}
                    <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPostPage;
