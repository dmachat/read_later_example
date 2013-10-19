<?php
/*
 * @file template for the read later notification
 *
 * @variables
 * - $user: User or Anonymous
 *
 */
?>
<?php if (!$user): ?>
  <div id="read-later-header">
    <a href="/user/register">
      <strong>Users can scroll to their saved reading position.</strong>
    </a>
  </div>
<?php else: ?>
  <div id="read-later-header">
    <a href="#">
      <strong>Click here to continue reading where you left off.</strong>
    </a>
  </div>
<?php endif; ?>
