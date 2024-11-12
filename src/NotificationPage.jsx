import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackButton from './BackButton';
import axios from 'axios';

const NotificationContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-weight: 700;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const SendButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-transform: uppercase;
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const NotificationItem = styled.div`
  padding: 15px;
  margin: 10px 0;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
  &:hover {
    background: #e2e6ea;
  }
`;

const HostelerName = styled.h4`
  margin: 0;
  color: #007bff;
  font-weight: 600;
`;

const Message = styled.p`
  margin: 5px 0 0;
  color: #555;
  font-size: 14px;
`;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [hostelers, setHostelers] = useState([]);
  const [selectedHosteler, setSelectedHosteler] = useState('');
  const [message, setMessage] = useState('Please pay your bill.');
  

  useEffect(() => {
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await axios.get('/api/hosteler-notifications');
    //     setNotifications(response.data);
    //     console.log(response.data,"llll")
    //   } catch (error) {
    //     console.error("Error fetching notifications:", error);
    //   }
    // };

    const fetchHostelers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/all-hostelers');
        setHostelers(response.data);
        console.log(response.data,"llll")
      } catch (error) {
        console.error("Error fetching hostelers:", error);
      }
    };

   // fetchNotifications();
    fetchHostelers();
  }, []);

  const handleSendMessage = async () => {
    if (selectedHosteler && message) {
      console.log(selectedHosteler,"ll")
      try {
        await axios.post('http://localhost:5000/api/send-message', { hostelerId: selectedHosteler, message });
        alert('Message sent successfully!');
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      alert('Please select a hosteler and enter a message.');
    }
  };

  const preTypedMessages = [
    "Please pay your bill.",
    "Today is a holiday.",
   
    "Maintenance work tomorrow."
  ];

  return (
    <NotificationContainer>
      <BackButton/>
      <Title>Hosteler Notifications</Title>
      <Dropdown
        value={selectedHosteler}
        onChange={(e) => setSelectedHosteler(e.target.value)}
      >
        <option value="">Select Hosteler</option>
        {hostelers.map((hosteler) => (
          <option key={hosteler._id} value={hosteler._id}>
            {hosteler.name}
          </option>
        ))}
      </Dropdown>
      <Dropdown
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      >
        <option value="">Select Pre-typed Message</option>
        {preTypedMessages.map((msg, index) => (
          <option key={index} value={msg}>
            {msg}
          </option>
        ))}
      </Dropdown>
      <SendButton onClick={handleSendMessage}>Send Message</SendButton>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem key={notification.id}>
            <HostelerName>{notification.name}</HostelerName>
            <Message>{notification.notification}</Message>
          </NotificationItem>
        ))
      ) : (
        <p>No notifications for hostelers at this time.</p>
      )}
    </NotificationContainer>
  );
};

export default NotificationPage;
