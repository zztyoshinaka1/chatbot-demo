import React, { useCallback, useEffect,useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextInput from './TextInput';

const FormDialog = (props) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
  
    const inputName = useCallback((event) => {
        setName(event.target.value)
    }, [setName]);

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    },[setEmail]);

    const inputDescription = useCallback((event) => {
        setDescription(event.target.value)
    },[setDescription]);

    const validateEmailFormat = (email) => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        return regex.test(email)
    }

    const validateRequiredInput = (...args) => {
        let isBlank = false;
        for (let i = 0; i < args.length; i=(i+1)|0) {
            if (args[i] === "") {
                isBlank = true;
            }
        }
        return isBlank
    };

    const submitform = () => {
        const isBlank = validateRequiredInput(name, email, description)
        const isValidEmail = validateEmailFormat(email)

        if (isBlank) {
            alert('必須入力欄が空白です。')
            return false
        } else if (!isValidEmail) {
            alert('メールアドレスの書式が異なります。')
            return false
        } else {
            const payload = {
                text: 'お問い合わせがありました\n'
                    + 'お名前: ' + name + '\n'
                    + 'メールアドレス: ' + email + '\n'
                    + '【問い合わせ内容】\n' + description
            };
            
            //Slack（ヘイセイの吉中チャンネルで）のIncommingWebHookで得たURL
            const url = 'https://hooks.slack.com/services/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'

            // fetchメソッドでフォームの内容をSlackのIncoming Webhook URL に送信する
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload)
            }).then(() => {
                alert('送信が完了しました。追ってご連絡いたします🙌');
                setName("")
                setEmail("")
                setDescription("")
                return props.handleClose()
            })
        }        
    }

    return(
        <Dialog open={props.open} onClose={props.handleClose} >
            <DialogTitle id="alert-dialog-title">お問い合わせフォーム</DialogTitle>
            <DialogContent>
                <TextInput 
                    label={"お名前（必須）"}  multiline={false}  rows={1}
                    value={name}  type={"text"} onChange={inputName}
                />
                <TextInput 
                    label={"メールアドレス（必須）"}  multiline={false}  rows={1}
                    value={email}  type={"email"} onChange={inputEmail}
                />
                <TextInput 
                    label={"お問い合わせ内容（必須）"}  multiline={true}  rows={5}
                    value={description}  type={"text"} onChange={inputDescription}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    キャンセル
                </Button>
                <Button onClick={submitform} color="primary" autoFocus>
                    送信する
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FormDialog;