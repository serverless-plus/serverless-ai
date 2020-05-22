import React, { useState, useEffect } from 'react';
import {
  Layout,
  Upload,
  Row,
  Col,
  Button,
  Collapse,
  Input,
  message,
} from 'antd';
import { useLocalStorage } from 'react-use';
import { uploadToCos, getOcrResult } from '../apis';

const { Header, Footer, Content } = Layout;
const { Panel } = Collapse;

function OcrResult({ data }) {
  return (
    <Collapse defaultActiveKey={[0]}>
      <Panel header='Recognize Result' key={0}>
        <ul>
          {data.map((item, index) => (
            <li key={index}>{`${index + 1}. ${item.DetectedText}`}</li>
          ))}
        </ul>
      </Panel>
      <Panel header='All Result' key={1}>
        {JSON.stringify(data)}
      </Panel>
    </Collapse>
  );
}

function OrcImage({ setTextList }) {
  const [loading, setLoading] = useState(false);
  const [uuid] = useLocalStorage('uuid');
  const [imageUrl, setImageUrl] = useState('');

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  async function uploadImage(action) {
    if (action.action && action.file) {
      try {
        setLoading(true);
        const url = await uploadToCos(uuid, action.file);
        setImageUrl(url);
        setLoading(false);
      } catch (e) {
        message.error(e.Message);
      }
    }

    return true;
  }
  useEffect(() => {
    async function recognizeImage(url) {
      if (!url) {
        return;
      }
      try {
        const { data } = await getOcrResult(url);
        setTextList(data);
      } catch (e) {
        message.error(e.Message);
      }
    }
    recognizeImage(imageUrl);
  }, [imageUrl, setTextList]);

  return (
    <Row>
      <Row className='image-box'>
        <Col span={24} className='image-wrapper'>
          {imageUrl ? (
            <img alt='OCR Images' src={imageUrl} width='100%' height='auto' />
          ) : (
            <span>Please Select Image.</span>
          )}
        </Col>
      </Row>
      <Row className='upload-container'>
        <Col span={24}>
          <Input.Group compact>
            <Input
              className='image-url-input'
              value={imageUrl}
              placeholder='Please select image or input image url'
              onChange={async (e) => {
                const url = e.target.value;
                setImageUrl(url);
              }}
            />
            <Upload
              name='file'
              action={uploadImage}
              className='upload-btn'
              showUploadList={false}
              customRequest={uploadImage}
              beforeUpload={beforeUpload}>
              <Button type='primary' loading={loading}>
                Select
              </Button>
            </Upload>
          </Input.Group>
        </Col>
      </Row>
    </Row>
  );
}

export default function Home() {
  const [textList, setTextList] = useState([]);

  return (
    <Layout>
      <Header>Serverless OCR</Header>
      <Content>
        <Row justify='center' align='center' gutter={[20, 20]}>
          <Col span={8}>
            <OrcImage setTextList={setTextList} />
          </Col>
          <Col span={8}>
            <OcrResult data={textList} />
          </Col>
        </Row>
      </Content>
      <Footer>
        Serverless OCR ©2020 Created by{' '}
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://github.com/yugasun'>
          yugasun
        </a>
      </Footer>
    </Layout>
  );
}
