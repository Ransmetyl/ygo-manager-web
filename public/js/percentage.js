function getColorFromPercentage(percentage) {
    if (percentage < 25) {
        return "#ff6347"; // Rosso
    } else if (percentage < 50) {
        return "#ffa500"; // Arancione
    } else if (percentage < 75) {
        return "#ffd700"; // Giallo
    } else {
        return "#32cd32"; // Verde
    }
}
