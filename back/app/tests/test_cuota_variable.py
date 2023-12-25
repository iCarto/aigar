from app.models.invoice import calculate_variable_fee


def test_for_consumo0():
    tramos = [
        {"cost": 1, "limit": 14},
        {"cost": 0.75, "limit": 20},
        {"cost": 2, "limit": float("inf")},
    ]
    consumo_final = 0
    result = calculate_variable_fee(tramos, consumo_final)

    assert result == 0


def test_for_consumo_not0():
    tramos = [
        {"cost": 1, "limit": 14},
        {"cost": 0.75, "limit": 20},
        {"cost": 2, "limit": float("inf")},
    ]
    consumo_final = 2
    result = calculate_variable_fee(tramos, consumo_final)

    assert result == 2 * 1


def test_for_consumo_in_first_limit():
    tramos = [
        {"cost": 1, "limit": 14},
        {"cost": 0.75, "limit": 20},
        {"cost": 2, "limit": float("inf")},
    ]
    consumo_final = 14
    result = calculate_variable_fee(tramos, consumo_final)

    assert result == 14 * 1


def test_for_consumo_in_second_limit():
    tramos = [
        {"cost": 1, "limit": 14},
        {"cost": 0.75, "limit": 20},
        {"cost": 2, "limit": float("inf")},
    ]
    consumo_final = 20
    result = calculate_variable_fee(tramos, consumo_final)

    assert result == (14 * 1) + (6 * 0.75)


def test_for_consumo_upper_that_second_limit():
    tramos = [
        {"cost": 0, "limit": 14},
        {"cost": 1, "limit": 20},
        {"cost": 2, "limit": float("inf")},
    ]
    consumo_final = 25
    result = calculate_variable_fee(tramos, consumo_final)

    assert result == (14 * 0) + (6 * 1) + (5 * 2)
