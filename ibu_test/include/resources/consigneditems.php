// <?php

// class ConsignedItem extends Resource
// {
// 	protected $book;
// 	protected $consigned_item;
// 	protected $price;
// 	protected $current_state;
	
// 	function __construct($params)
// 	{
// 		$this->setBook($params["book"]);
// 		$this->setConsignedItem($params["consigned_item"]);
// 		$this->setPrice($params["price"]);
// 		$this->setCurrentState($params["current_state"]);
// 	}

// //setters
// 	private function setConsignedItem($consigned_item) {$this->consigned_item = $consigned_item;}
// 	private function setPrice($price) {$this->price = $price;}
// 	private function setBook($book) {$this->book = $book;}
// 	private function setCurrentState($current_state) {$this->current_state = $current_state;}
// //getters
// 	public function getConsignedItem() {return $this->consigned_item;}
// 	public function getPrice() {return $this->price;}
// 	public function getBook() {return $this->book;}
// 	public function getCurrentState() {return $this->current_state;}

// 	public function printOut() {
// 		$consigned_item = $this->getConsignedItem();
// 		$price = $this->getPrice();
// 		$current_state = $this->getCurrentState();
// 		$book = $this->getBook();

// 		echo "This is the consigned_item number: \n";
// 		var_dump($consigned_item);
// 		echo "This is the book: \n";
// 		$book->printOut();
// 		echo "This is the price: \n";
// 		var_dump($price);
// 		echo "This is the current state: \n";
// 		var_dump($current_state);
// 	}

// 	public function getPoster($conn) {
// 		// check whether the resouce to be created existed prior
// 		// to trying to create it again
// 		$posters = array();
// 		$results = array();

// 		$results = $this->confirmResourceDoesNotExist($conn);
// 		if ($results["consignedItemResult"])
// 			$posters[] = new NullPoster();
// 		else if ($results["bookResult"]) {
// 			$posters[] = new ConsignedItemPoster($this, $conn);
// 		} else {
// 			$posters[] = new ConsignedItemPoster($this, $conn);
// 			$posters[] = new BookPoster($this, $conn);
// 		}
		
// 		return $posters;
// 	}

// 	// should check if the consigned item exists
// 	// if it does there is no need to check if the book does
// 	// if it doesn't should check if the book does
// 	private function confirmResourceDoesNotExist($conn) 
// 	{
// 		$results = array();
// 		$getter = $this->getGetter($conn);
// 		$consignedItemGetter = $getter["consignedItem"];
// 		$bookGetter = $getter["book"];

// 		$results["consignedItemResult"] = $consignedItemGetter->retrieve();
// 		$results["bookResult"] = $bookGetterGetter->retrieve();
// 		return $results;
// 	}

// 	public function getGetter($conn)
// 	{
// 		$getters = array();
// 		$consignedItemGetter = new ConsignedItemGetter($this, $conn);
// 		$bookGetter = new BookGetter($this, $conn);
// 		$getters["consignedItem"] = $consignedItemGetter;
// 		$getters["book"] = $book;
// 		return $getters;
// 	}

// 	public function getDeleter($conn) {

// 	}
// }