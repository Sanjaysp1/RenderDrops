import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.2 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call for offline functionality
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@renderdrops.com',
      testId: 'contact-info-email',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      testId: 'contact-info-phone',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'University Campus, Building A',
      testId: 'contact-info-location',
    },
  ];

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      data-testid="contact-page" 
      className="min-h-screen pt-32 pb-20"
    >
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-6xl sm:text-7xl font-black uppercase tracking-tighter text-white mb-6">
              Get In <span className="text-[#FF0033]">Touch</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Have a project in mind? Let's collaborate and bring your vision to life.
              Fill out the form below and we'll get back to you shortly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form
                data-testid="contact-form"
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl"
              >
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-white font-semibold mb-2 ml-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      data-testid="contact-input-name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:bg-white/10 focus:border-[#FF0033]/50 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2 ml-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      data-testid="contact-input-email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:bg-white/10 focus:border-[#FF0033]/50 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-white font-semibold mb-2 ml-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      data-testid="contact-input-subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:bg-white/10 focus:border-[#FF0033]/50 transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-white font-semibold mb-2 ml-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      data-testid="contact-input-message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:bg-white/10 focus:border-[#FF0033]/50 transition-all duration-300 resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    data-testid="contact-submit-btn"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-bold py-5 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-4"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        data-testid="contact-success-message"
                        className="p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-400 text-center font-medium"
                      >
                        Thank you! Your message has been sent successfully.
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        data-testid="contact-error-message"
                        className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-400 text-center font-medium"
                      >
                        Oops! Something went wrong. Please try again.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
                <p className="text-neutral-300 leading-relaxed mb-10 font-medium">
                  Ready to start a project or just want to chat? We're here to help bring your ideas to life.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        data-testid={info.testId}
                        className="flex items-center space-x-5 p-4 rounded-2xl hover:bg-white/5 transition-colors"
                      >
                        <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                          <Icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{info.title}</h3>
                          <p className="text-neutral-400 font-medium">{info.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
                <h3 className="text-white font-bold text-2xl mb-6">Office Hours</h3>
                <div className="space-y-4 text-neutral-300 font-medium">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span>Monday - Friday</span>
                    <span className="text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span>Saturday</span>
                    <span className="text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sunday</span>
                    <span className="text-neutral-500">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;
