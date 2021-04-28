      {/* Payment method modal*/}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select a payment method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom(paymentsSUBID[0]);
              setShowPaymentModal(false);
            }}
          >
            <img alt="kredi" className="mr-2" src={kredi} />
            <h4>Anında Kredi Kartı</h4>
          </div>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom(paymentsSUBID[1]);
              setShowPaymentModal(false);
            }}
          >
            <img alt="havale" className="mr-2" src={havale} />
            <h4>Anında Havale</h4>
          </div>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom(paymentsSUBID[2]);
              setShowPaymentModal(false);
            }}
          >
            <img alt="papara" className="mr-2" src={papara} />
            <h4>Jet Papara</h4>
          </div>
          {/* <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom("Anında BTC");
              setShowPaymentModal(false);
            }}
          >
            <img alt="btc" className="mr-2" src={btc} />
            <h4>Anında BTC</h4>
          </div> */}
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom(paymentsSUBID[3]);
              setShowPaymentModal(false);
            }}
          >
            <img alt="mefete" className="mr-2" src={mefete} />
            <h4>Anında Mefete</h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
