import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Container = styled.div`
  background: #00000;
  padding: 40px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.div`
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5rem;
  border-radius: 8px;
  text-align: center;
`;

const Title = styled.h1`
  color: #343a40;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Lead = styled.p`
  color: #6c757d;
  margin-bottom: 1.5rem;
`;

const StyledButton = styled(Link)`
  padding: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: block;
  text-align: center;
  margin-bottom: 1rem;
  color: #fff;

  &:hover {
    transform: scale(1.05);
  }

  &.btn-primary {
    background-color: #007bff;
    border-color: #007bff;

    &:hover {
      background-color: #0056b3;
      border-color: #004085;
    }
  }

  &.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;

    &:hover {
      background-color: #545b62;
      border-color: #343a40;
    }
  }

  &.btn-success {
    background-color: #28a745;
    border-color: #28a745;

    &:hover {
      background-color: #218838;
      border-color: #1e7e34;
    }
  }

  &.btn-info {
    background-color: #17a2b8;
    border-color: #17a2b8;

    &:hover {
      background-color: #138496;
      border-color: #117a8b;
    }
  }

  &.btn-warning {
    background-color: #ffc107;
    border-color: #ffc107;

    &:hover {
      background-color: #e0a800;
      border-color: #d39e00;
    }
  }

  &.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;

    &:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }
  }

  &.btn-dark {
    background-color: #343a40;
    border-color: #343a40;

    &:hover {
      background-color: #23272b;
      border-color: #1d2124;
    }
  }
`;

const NotificationButton = styled.button`
  padding: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  background-color: #6c757d;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: block;
  width: 100%;
  text-align: center;

  &:hover {
    transform: scale(1.05);
    background-color: #545b62;
  }
`;

const Admin = () => {
  return (
    <Container>
      <Overlay>
        <Title className="display-4 mb-4">Admin Dashboard</Title>
        <Lead className="lead mb-4">Manage canteen operations and oversee the entire system here.</Lead>
        <div className="row">
          <div className="col-12 col-md-6 mb-3">
            <StyledButton to="/manage-users" className="btn-primary btn-block btn-lg">
              Manage Users
            </StyledButton>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <StyledButton to="/view-reports" className="btn-secondary btn-block btn-lg">
              View Reports
            </StyledButton>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <StyledButton to="/update-menu" className="btn-success btn-block btn-lg">
              Update Menu
            </StyledButton>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <StyledButton to="/process-orders" className="btn-info btn-block btn-lg">
              Process Orders
            </StyledButton>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <StyledButton to="/manage-stock" className="btn-warning btn-block btn-lg">
              Manage Stock
            </StyledButton>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <StyledButton to="/hostelers-info" className="btn-danger btn-block btn-lg">
              Hostelers Info
            </StyledButton>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <StyledButton to="/updatebill" className="btn-dark btn-block btn-lg">
              Update Bills
            </StyledButton>
          </div>
          <div className="col-12 col-md-6 mb-3">
          <StyledButton to="/NotificationPage" className="btn-dark btn-block btn-lg">
              Notification
            </StyledButton>
          </div>
        </div>
      </Overlay>
    </Container>
  );
};

export default Admin;
