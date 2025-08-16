import React from 'react';
import { Card } from '@/components/ui/Card';
import { Users, Target, Zap } from 'lucide-react';

// Import images from assets
import mugambiImage from '@/assets/images/mugambi_john_ndeke.jpg.jpg';
import tsionImage from '@/assets/images/tsion_tamirat.jpg.jpg';

const AboutPage = () => {
    const foundingTeam = [
        {
            name: 'Mugambi (John) Ndeke',
            role: 'Co-Founder & AI Lead',
            bio: "As the visionary behind Applaude, John combines deep technical expertise with a powerful drive to solve real-world problems. He is a full-stack AI Software Engineer who builds cutting-edge AI agentic systems and possesses a rare blend of skills in Python/Django, MySQL, and modern frontend development. But John is more than a coder; his foundation as an award-winning Digital Strategist gives him a unique lens on building a brand that resonates and a product that sells. He doesn't just deliver technical excellence; he builds with a strategic business perspective, ensuring Applaude is not only innovative but also impactful.",
            image: mugambiImage
        },
        {
            name: 'Tsion Tamirat',
            role: 'Co-Founder & Software Engineer',
            bio: "Tsion is a motivated and versatile Software Engineer, driven by a passion for creating impactful, user-focused applications with clean, efficient code. With a strong foundation from Arba Minch University and practical experience at NGCS, she brings a robust skill set in both backend and frontend technologies. Her expertise spans C# (.NET Core), Python (Django), and modern frontend frameworks like React, ensuring our platform is not just powerful but also responsive and intuitive. A critical thinker and natural collaborator, Tsion is committed to continuous learning and plays a vital role in shaping the technical architecture and user experience of Applaude.",
            image: tsionImage
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <main className="pt-16 pb-16 px-4">
                {/* Hero Section */}
                <div className="max-w-6xl mx-auto text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Empowering Your Vision
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                        Applaude is built on the belief that a great idea shouldn't be limited by technology. We are a passionate team of AI engineers and product visionaries dedicated to creating a platform that empowers you to bring your mobile app ideas to life with unprecedented speed and simplicity.
                    </p>
                </div>

                {/* Mission Cards */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                        <p className="text-gray-600">
                            To democratize mobile app development by making it accessible to everyone, regardless of technical background.
                        </p>
                    </Card>
                    <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Technology</h3>
                        <p className="text-gray-600">
                            At the heart of Applaude is a sophisticated swarm of AI agents, each an expert in its domain, working together to create your perfect app.
                        </p>
                    </Card>
                    <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-pink-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                        <p className="text-gray-600">
                            A world where every business can have a beautiful, functional mobile app that drives growth and customer engagement.
                        </p>
                    </Card>
                </div>

                {/* Founding Team */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                        Meet Our Founding Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {foundingTeam.map(member => (
                            <Card key={member.name} className="p-8 hover:shadow-lg transition-shadow">
                                <div className="text-center mb-6">
                                    <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                                        onError={(e) => {
                                            // Fallback to placeholder if image fails to load
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff&size=128`;
                                        }}
                                    />
                                    <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                                    <p className="text-lg text-blue-600 font-semibold mb-4">{member.role}</p>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutPage;