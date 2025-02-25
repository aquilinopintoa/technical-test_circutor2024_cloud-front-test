import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Layout, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { LoginUser } from "../../../api/auth";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function LoginPage() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [submitErrorMsg, setSubmitErrorMsg] = useState(null)

    const redirectToRegister = () => {
        navigate("/register");
    };

    const resetSubmitError = () => {
        setSubmitErrorMsg(null)
    }

    const onFinish = ({ email, password }) => {
        if (!email || !password) {
            return;
        }

        LoginUser(email, password).then(data => {
            if (!data.Token) {
                // todo :: check use case
                navigate("/register");
            } else {
                localStorage.setItem('test-token', data.Token);
                localStorage.setItem('email', data.Email);
                navigate("/buildings");
            }
        }).catch((error) => {
            setSubmitErrorMsg(error.message)
        });
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <Title style={{ color: '#fff', margin: 0 }} level={3}>My Buildings</Title>
                <Button type="link" onClick={redirectToRegister} style={{ color: '#fff', float: 'right' }}>Register</Button>
            </Header>
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                    <Form
                        form={form}
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                        style={{ maxWidth: 300 }}
                    >
                        <Title level={2}>Login</Title>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                            
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" onChange={resetSubmitError} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" onChange={resetSubmitError} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Login
                            </Button>
                        </Form.Item>
                        { submitErrorMsg && <Text type="danger">{submitErrorMsg}</Text> }
                    </Form>
                </div>
            </Content>
        </Layout>
    );
}

