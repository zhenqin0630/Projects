# use-w3id-on-web-app/sample

此例子程序用中间件【saml2-js】实现了 w3id 单点登录。

- 请使用`certs/create-certs.sh`创建web app(https://test.mybluemix.net)对应的证书以及`metadata.xml`配置文件(将在申请w3id自助服务时使用到)

    ```
    cd ./certs
    ./create-certs.sh test
    ```

    执行完以上命令后，将在目录`certs`下创建以下文件
    ```
    certs/
    |-- test/
    |------- cert.pem           公钥
    |------- key.pem            私钥
    |------- metadata.xml       w3id使用saml2时必须的配置文件
    ```

- 开发时使用测试用户数据
    - 设置环境变量
        - NODE_ENV=development
        - TEST_USER={"userId":"testuser@xxx.com","userFirstName":"first","userLastName":"last","userDisplayName":"test-user","userCNum":"xxx-zzz-yyy","sessionIndex":"12345"}