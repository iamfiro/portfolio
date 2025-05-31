import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { copyToClipboard } from '../utils/clipboard';

const Contact = () => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const contactItems = [
    {
      icon: <FaGithub className="text-2xl" />,
      text: 'GitHub',
      value: 'https://github.com/yourusername',
      type: 'github'
    },
    {
      icon: <FaLinkedin className="text-2xl" />,
      text: 'LinkedIn',
      value: 'https://linkedin.com/in/yourusername',
      type: 'linkedin'
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      text: 'Email',
      value: 'your.email@example.com',
      type: 'email'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactItems.map((item) => (
          <motion.div
            key={item.type}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.text}</h3>
            <button
              onClick={() => handleCopy(item.value, item.type)}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              {copySuccess === item.type ? '복사됨!' : item.value}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Contact; 