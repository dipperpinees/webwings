package mail

import "gopkg.in/gomail.v2"

func Send(from string, password string, toList []string, subject string, content string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", toList[:]...)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", content)

	d := gomail.NewDialer("smtp.gmail.com", 587, from, password)

	err := d.DialAndSend(m)
	return err
}
