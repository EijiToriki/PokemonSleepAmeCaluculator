import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} ポケモンスリープ EXP 計算機
        </p>
        <p className="footer-disclaimer">
          ポケモンとポケットモンスターは任天堂、ゲームフリーク、クリーチャーズの登録商標です。
          当サイトは非公式であり、株式会社ポケモンとは一切関係ありません。
        </p>
      </div>
    </footer>
  )
}

export default Footer