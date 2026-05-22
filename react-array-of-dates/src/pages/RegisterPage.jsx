import { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../css/RegisterPage.css';

export const RegisterPage = ({ onSwitchToLogin, onLogin }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(data);
        message.success('Регистрация успешна! Выполняется вход...');
        onLogin({ userId: data.userId, favoriteCurrency: data.favoriteCurrency });
      } else {
        message.error(data.message || 'Ошибка регистрации');
      }
    } catch (error) {
      message.error('Ошибка соединения с сервером. Запустите backend: node server.js');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <h2 className="register-title">Регистрация</h2>
        <Form className="register-form" name="register" onFinish={onFinish} autoComplete="off">
          <Form.Item
            className="register-form__item"
            name="username"
            rules={[{ required: true, message: 'Введите логин!' }]}
          >
            <Input className="register-form__input" prefix={<UserOutlined />} placeholder="Логин" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>

          <Form.Item
            className="register-form__item"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите пароль!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password className="register-form__input" prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
          </Form.Item>

          <Form.Item className="register-form__item">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Зарегистрироваться
            </Button>
            или{' '}
            <Button type="link" onClick={onSwitchToLogin} className="login-link">
              Уже есть аккаунт? Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

