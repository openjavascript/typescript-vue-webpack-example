import { Component, Vue } from 'vue-property-decorator'
import bContainer from 'bootstrap-vue/es/components/layout/container'
import bCol from 'bootstrap-vue/es/components/layout/col'
import bRow from 'bootstrap-vue/es/components/layout/row'

import iview from 'iview';
import './item.less'

//import {request} from '../../../static/utils/fetch';
import {request} from '@static/example';


@Component({
    template: require( './item.html' )
})
export class LoginComponent extends Vue {

    package: string = 'vue-webpack-typescript'
    repo: string = 'https://github.com/ducksoupdev/vue-webpack-typescript'
    mode: string = process.env.ENV


    data () {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请填写密码'));
            } else {
                callback();
            }
        };
        
        return {
            formLogin: {
                formtype: 'normal',
                username: '',
                password: ''
            },
            loginRule: {
                username: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' }
                    , { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    }

    handleSubmit (name)  {
        console.log( 'handleSubmit', name, Date.now() );
        console.log( this.formLogin );
        let form = (this.$refs[name] as Vue)
        //console.log( 'form data', JSON.stringify( form.model ) );
        form.validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    }
    handleReset (name)  {
        console.log( 'handleReset', name, Date.now() );
        /*this.$refs[name].resetFields();*/
    }


}
