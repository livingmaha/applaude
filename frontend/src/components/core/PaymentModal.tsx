import React from 'react';
import Card from '../ui/Card';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const plans = [
        { name: 'One-Time', price: '$50', features: ['Single App Build', 'Lifetime Access to Code'] },
        { name: 'Monthly', price: '$15/mo', features: ['Unlimited App Builds', 'Continuous Updates', 'Priority Support'] },
        { name: 'Yearly', price: '$150/yr', features: ['All Monthly Features', '2 Months Free'] },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {plans.map(plan => (
                        <Card key={plan.name} className="p-6 text-center">
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-3xl font-bold mb-4">{plan.price}</p>
                            <ul className="text-gray-400 mb-4">
                                {plan.features.map(feature => <li key={feature}>{feature}</li>)}
                            </ul>
                            <button className="bg-fusion-pink text-white font-bold py-2 px-4 rounded">Select Plan</button>
                        </Card>
                    ))}
                </div>
                <button onClick={onClose} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded">Close</button>
            </Card>
        </div>
    );
};

export default PaymentModal;
