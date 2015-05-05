<?php

class ArrayManager
{

    /*
    * @_arrayManager();
    **/
    private $_arrayManager;

    /*
    * @_start();
    **/
    private $_start = 0;

    /*
    * @_end();
    **/
    private $_end = 10;

    /*
    * @load();
    **/
    public static function load($array,$class = __CLASS__)
    {
        $classes = new $class();
        return $classes->setArray($array);
    }

    /*
    * @setArray();
    **/
    public function setArray($array)
    {
        $this->arrayManager = $array;
        return $this;
    }

    /*
    * @limit();
    **/
    public function limit($start = 0,$end = 5)
    {
        $this->_start = $start;
        $this->_end = $end;
        return $this;
    }

    public function count()
    {
        return count($this->arrayManager);
    }
    /*
    * @all();
    **/
    public function all()
    {
        return array_slice($this->arrayManager,$this->_start,$this->_end);
    }
}