Feature: Allow the user to add new children


  Background: Bed time fairy database is empty, this is the first time the user has used the service.


  Scenario: User can add a child
    When the user says "Please add a new child"
    Then Alexa replies "Tell me your childs' name"
    Then the user says "Fred"
    And Alexa replies "What time does Fred go to bed?"
    Then the user says "Seven thirty"
    Then Alexa replies "OK, I have set Fred's bedtime to seven thirty"


  Scenario: User adds their daughter
    Given the user has a son named Fred with a bed time of 19:30
    Then Alexa replies "Tell me your childs' name"
    Then the user says "Fred"
    And Alexa replies "What time does Fred go to bed?"
    Then the user says "Seven thirty"
    Then Alexa replies "It looks like you have already added a bed time for Fred"


  Scenario: User adds their son



  Scenario: User
