import { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { RegisterPage } from './RegisterPage';
import '../css/LoginPage.css';

export const LoginPage = ({ onLogin }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success('Вход выполнен успешно!');
        onLogin();
      } else {
        message.error(data.message || 'Ошибка входа');
      }
    } catch (error) {
      message.error('Ошибка соединения с сервером. Запустите backend: node server.js');
    } finally {
      setLoading(false);
    }
  };

  if (isRegisterMode) {
    return <RegisterPage onSwitchToLogin={() => setIsRegisterMode(false)} onLogin={onLogin} />;
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2 className="login-title">Вход в приложение</h2>
        <Form
          className="login-form"
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            className="login-form__item"
            name="username"
            rules={[{ required: true, message: 'Введите ваш логин!' }]}
          >
            <Input className="login-form__input" prefix={<UserOutlined />} placeholder="Логин" />
          </Form.Item>

          <Form.Item
            className="login-form__item"
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password className="login-form__input" prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>

          <Form.Item className="login-form__item">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
            или{' '}
            <Button type="link" onClick={() => setIsRegisterMode(true)} className="register-link">
              Зарегистрироваться!
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
