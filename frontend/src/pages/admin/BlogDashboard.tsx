import { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { BlogPost } from '../../types';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';

const BlogDashboard = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/blog/');
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
    };

    const handleNewPost = () => {
        setEditingPost({ title: '', content: '', is_published: false });
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await apiClient.delete(`/blog/${id}/`);
                fetchPosts();
            } catch (error) {
                console.error("Failed to delete post:", error);
                alert('Failed to delete post.');
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) return;

        const isNew = !editingPost.id;
        const url = isNew ? '/blog/' : `/blog/${editingPost.id}/`;
        const method = isNew ? 'post' : 'put';

        try {
            await apiClient[method](url, editingPost);
            setEditingPost(null);
            fetchPosts();
        } catch (error) {
            console.error("Failed to save post:", error);
            alert('Failed to save post.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8 text-soft-white">
            <h1 className="text-3xl font-bold mb-6">Blog Management</h1>

            {editingPost ? (
                <Card className="p-6 mb-8">
                    <form onSubmit={handleSave}>
                        <h2 className="text-2xl font-bold mb-4">{editingPost.id ? 'Edit Post' : 'Create New Post'}</h2>
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Post Title"
                                value={editingPost.title || ''}
                                onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Post Content (HTML allowed)"
                                rows={10}
                                className="w-full bg-gray-700 bg-opacity-30 text-soft-white p-3 rounded-lg focus:border-ion-blue focus:ring-0 focus:outline-none"
                                value={editingPost.content || ''}
                                onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                                required
                            />
                            <Input
                                type="url"
                                placeholder="Main Image URL"
                                value={editingPost.main_image_url || ''}
                                onChange={e => setEditingPost({ ...editingPost, main_image_url: e.target.value })}
                            />
                             <div className="flex items-center gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-fusion-pink bg-gray-700 border-gray-600 rounded focus:ring-fusion-pink"
                                        checked={editingPost.is_published}
                                        onChange={e => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                                    />
                                    <span className="ml-2">Published</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button type="button" onClick={() => setEditingPost(null)} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-ion-blue text-black font-bold rounded-lg hover:bg-opacity-90">Save Post</button>
                        </div>
                    </form>
                </Card>
            ) : (
                <button onClick={handleNewPost} className="mb-8 px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg flex items-center gap-2 hover:bg-opacity-90">
                    <Plus size={20} /> New Post
                </button>
            )}

            <div className="space-y-4">
                {posts.map(post => (
                    <Card key={post.id} className="p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{post.title}</h3>
                            <p className={`text-sm ${post.is_published ? 'text-green-400' : 'text-solar-orange'}`}>
                                {post.is_published ? 'Published' : 'Draft'}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => handleEdit(post)} className="p-2 hover:text-ion-blue"><Edit size={20} /></button>
                            <button onClick={() => handleDelete(post.id)} className="p-2 hover:text-solar-orange"><Trash2 size={20} /></button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BlogDashboard;
