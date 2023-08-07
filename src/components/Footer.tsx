import { 
  Footer,
} from '@mantine/core'

export default function GlobalFooter() {
    return (
        <Footer height={100} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <p className="subtext">Name: Tim Pham</p>
          <p className="subtext">Contact: timtpham@gmail.com</p>
        </Footer>
    )
}