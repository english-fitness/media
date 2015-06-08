<?php
class Pagination
{

    /*
    * @totalCount;
    **/
    public $totalCount;

    /*
    * @pageSize;
    **/
    public $pageSize;

    /*
    * @totalPage;
    **/
    public $totalPage;

    /*
    * @offset;
    **/
    public $offset;

    /*
    * @totalPage;
    **/
    public $currentPage;

    /*
    * @__construct;
    **/
    public function __construct($arrays = array())
    {
        if(is_array($arrays ))  {
            foreach($arrays as $key=>$value) {
                $this->$key = $value;
            }
        }

    }

    /*
    * @run();
    **/
    public static function  run($arrays,$class =__CLASS__)
    {
        $classes = new $class($arrays);
        $classes->currentPage = isset($_GET['page'])?$_GET['page']:0;
        return $classes->setOffset();
    }

    /*
    * @setOffset();
    **/
    public function setTotalPage()
    {
        $this->totalPage = ceil($this->totalCount/$this->pageSize);
        return $this;
    }

    /*
    * @setOffset();
    **/
    public function setOffset()
    {
        $this->offset = ($this->currentPage*$this->pageSize);
        return $this->setTotalPage();
    }
}
